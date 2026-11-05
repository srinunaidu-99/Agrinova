from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

import os
import numpy as np
import tensorflow as tf
from datetime import datetime, timezone


import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
# ========================================
# FLASK APP
# ========================================

app = Flask(__name__)

CORS(app)


# ========================================
# PATHS
# ========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "plant_disease_efficientnet.keras"
)

LABELS_PATH = os.path.join(
    BASE_DIR,
    "model",
    "class_names.txt"
)


# ========================================
# SERVER BANNER
# ========================================

print("========================================")
print("🌱 AGRINOVA CROP DISEASE AI")
print("========================================")
print("Python:", __import__("sys").version.split()[0])
print("TensorFlow:", tf.__version__)
print("Model path:", MODEL_PATH)
print("Labels path:", LABELS_PATH)
print("========================================")


# ========================================
# LEGACY BATCH NORMALIZATION COMPATIBILITY
# ========================================

class CompatibleBatchNormalization(
    tf.keras.layers.BatchNormalization
):
    """
    Compatibility layer for models saved with
    older BatchNormalization configuration.

    Old model files may contain:
        renorm
        renorm_clipping
        renorm_momentum

    Current Keras versions no longer use these
    constructor arguments.
    """

    def __init__(self, *args, **kwargs):

        # Remove unsupported legacy arguments
        kwargs.pop("renorm", None)
        kwargs.pop("renorm_clipping", None)
        kwargs.pop("renorm_momentum", None)

        super().__init__(
            *args,
            **kwargs
        )


# ========================================
# LOAD AI MODEL
# ========================================

print("Loading AI model...")

model = None

try:

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found: {MODEL_PATH}"
        )

    model = tf.keras.models.load_model(
        MODEL_PATH,
        custom_objects={
            "BatchNormalization":
                CompatibleBatchNormalization
        },
        compile=False
    )

    print("✅ Model loaded successfully")
    print("Input shape:", model.input_shape)
    print("Output shape:", model.output_shape)

except Exception as error:

    print("❌ Model loading failed")
    print("----------------------------------------")
    print("Error type:", type(error).__name__)
    print("Error:", str(error))
    print("----------------------------------------")

    raise


# ========================================
# LOAD DISEASE LABELS
# ========================================

print("Loading disease labels...")

try:

    if not os.path.exists(LABELS_PATH):
        raise FileNotFoundError(
            f"Labels file not found: {LABELS_PATH}"
        )

    with open(
        LABELS_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        class_names = [
            line.strip()
            for line in file
            if line.strip()
        ]

    print(
        "✅ Labels loaded:",
        len(class_names)
    )

except Exception as error:

    print("❌ Label loading failed")
    print("----------------------------------------")
    print("Error type:", type(error).__name__)
    print("Error:", str(error))
    print("----------------------------------------")

    raise


# ========================================
# VALIDATE MODEL + LABELS
# ========================================

try:

    model_classes = int(
        model.output_shape[-1]
    )

except Exception:

    model_classes = None


if model_classes is None:

    raise ValueError(
        "Unable to determine model output classes."
    )


if len(class_names) != model_classes:

    raise ValueError(
        f"Label count ({len(class_names)}) "
        f"does not match model output "
        f"({model_classes})."
    )


print("✅ Model and labels match")
print(
    "✅ Total disease classes:",
    len(class_names)
)
print("========================================")


# ========================================
# UTC TIME
# ========================================

def utc_timestamp():

    return datetime.now(
        timezone.utc
    ).isoformat()


# ========================================
# HEALTH / ROOT
# ========================================

@app.get("/")
def home():

    return jsonify({

        "success": True,

        "message":
            "Agrinova Crop Disease AI is running",

        "model":
            "PlantVillage EfficientNet",

        "classes":
            len(class_names),

        "inputSize":
            "224x224",

        "service":
            "crop-disease-ai"

    }), 200


# ========================================
# HEALTH CHECK
# ========================================

@app.get("/health")
def health():

    return jsonify({

        "success": True,

        "service":
            "crop-disease-ai",

        "model_loaded":
            model is not None,

        "classes":
            len(class_names),

        "input_shape":
            str(model.input_shape)
            if model is not None
            else None,

        "output_shape":
            str(model.output_shape)
            if model is not None
            else None,

        "timestamp":
            utc_timestamp()

    }), 200


# ========================================
# IMAGE PREDICTION
# ========================================

@app.post("/predict")
def predict():

    try:

        print("")
        print("========================================")
        print("🌱 NEW CROP IMAGE REQUEST")
        print("========================================")


        # ------------------------------------
        # DEBUG REQUEST
        # ------------------------------------

        print(
            "Content-Type:",
            request.content_type
        )

        print(
            "Files received:",
            list(request.files.keys())
        )

        print(
            "Form fields:",
            list(request.form.keys())
        )


        # ------------------------------------
        # CHECK IMAGE FIELD
        # ------------------------------------

        if "image" not in request.files:

            print("❌ Image field missing")

            return jsonify({

                "success": False,

                "message":
                    "Image file is required.",

                "received_fields":
                    list(request.files.keys()),

                "content_type":
                    request.content_type

            }), 400


        file = request.files["image"]


        # ------------------------------------
        # CHECK FILE OBJECT
        # ------------------------------------

        if file is None:

            print("❌ File object is empty")

            return jsonify({

                "success": False,

                "message":
                    "Image file is empty."

            }), 400


        # ------------------------------------
        # CHECK FILENAME
        # ------------------------------------

        if not file.filename:

            print("❌ Filename is empty")

            return jsonify({

                "success": False,

                "message":
                    "No image selected."

            }), 400


        print(
            "📷 Filename:",
            file.filename
        )

        print(
            "📦 Content type:",
            file.content_type
        )


        # ------------------------------------
        # OPEN IMAGE
        # ------------------------------------

        print("🖼️ Opening image...")

        image = Image.open(
            file.stream
        ).convert("RGB")

        print(
            "Original size:",
            image.size
        )


        # ------------------------------------
        # RESIZE TO MODEL INPUT
        # ------------------------------------

        image = image.resize(
            (224, 224)
        )

        print(
            "Resized size:",
            image.size
        )


        # ------------------------------------
        # CONVERT TO NUMPY
        # ------------------------------------

        image_array = np.array(
            image
        ).astype("float32")


        # ------------------------------------
        # ADD BATCH DIMENSION
        # ------------------------------------

        image_array = np.expand_dims(
            image_array,
            axis=0
        )


        print(
            "🔄 Model input:",
            image_array.shape
        )


        # ------------------------------------
        # MODEL PREDICTION
        # ------------------------------------

        print(
            "🤖 Running AI model..."
        )

        predictions = model.predict(
            image_array,
            verbose=0
        )[0]


        # ------------------------------------
        # BEST PREDICTION
        # ------------------------------------

        predicted_index = int(
            np.argmax(predictions)
        )

        confidence = float(
            predictions[predicted_index]
        )

        disease_name = class_names[
            predicted_index
        ]

        confidence_percent = round(
            confidence * 100,
            2
        )


        # ------------------------------------
        # TOP 3 PREDICTIONS
        # ------------------------------------

        top_indices = np.argsort(
            predictions
        )[::-1][:3]

        top_predictions = []


        for index in top_indices:

            index = int(index)

            top_predictions.append({

                "disease":
                    class_names[index],

                "confidence":
                    round(
                        float(
                            predictions[index]
                        ) * 100,
                        2
                    )

            })


        # ------------------------------------
        # HEALTH STATUS
        # ------------------------------------

        is_healthy = (
            "healthy"
            in disease_name.lower()
        )

        health_status = (

            "Healthy"

            if is_healthy

            else "Disease Detected"
        )


        # ------------------------------------
        # LOG RESULT
        # ------------------------------------

        print("----------------------------------------")

        print(
            "🌱 Prediction:",
            disease_name
        )

        print(
            "🎯 Confidence:",
            confidence_percent,
            "%"
        )

        print(
            "📊 Status:",
            health_status
        )

        print(
            "🏆 Top 3:",
            top_predictions
        )

        print("========================================")


        # ------------------------------------
        # RESPONSE
        # ------------------------------------

        return jsonify({

            "success":
                True,

            "prediction": {

                "disease":
                    disease_name,

                "confidence":
                    confidence_percent,

                "status":
                    health_status,

                "healthy":
                    is_healthy,

                "topPredictions":
                    top_predictions

            },

            "analyzedAt":
                utc_timestamp()

        }), 200


    # ========================================
    # PREDICTION ERROR
    # ========================================

    except Exception as error:

        print("")
        print("❌ Prediction error")
        print("----------------------------------------")

        print(
            "Error type:",
            type(error).__name__
        )

        print(
            "Error:",
            str(error)
        )

        print("----------------------------------------")


        return jsonify({

            "success":
                False,

            "message":
                "Unable to analyze crop image.",

            "error":
                str(error),

            "errorType":
                type(error).__name__

        }), 500


# ========================================
# GLOBAL 404
# ========================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({

        "success": False,

        "message":
            "API endpoint not found.",

        "availableEndpoints": [

            "GET /",

            "GET /health",

            "POST /predict"

        ]

    }), 404


# ========================================
# GLOBAL SERVER ERROR
# ========================================

@app.errorhandler(500)
def internal_error(error):

    return jsonify({

        "success": False,

        "message":
            "Internal server error."

    }), 500


# ========================================
# START SERVER
# ========================================

if __name__ == "__main__":

    print("")
    print("========================================")
    print("🚀 Starting Agrinova AI API...")
    print("========================================")
    print("📡 http://localhost:5001")
    print("🌱 POST /predict")
    print("❤️ GET /health")
    print("========================================")
    print("")

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=False
    )