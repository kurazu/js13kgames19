import numpy as np
import tensorflow as tf
import io
import json


def serialize_layer(layer):
    kernel_weights = layer.kernel.numpy()
    bias_weights = layer.bias.numpy()
    return {
        "kernel": {
            "shape": list(kernel_weights.shape),
            "value": kernel_weights.tolist(),
        },
        "bias": {"shape": list(bias_weights.shape), "value": bias_weights.tolist()},
    }


def store_json(what, filename):
    with io.open(filename, "w", encoding="utf-8") as f:
        json.dump(what, f, indent=2)


def store_binary(what: bytes, filename: str) -> None:
    with io.open(filename, "wb") as f:
        f.write(what)


def store_weights(layer, filename):
    kernel_weights = layer.kernel.numpy().astype(np.float32)
    bias_weights = layer.bias.numpy().astype(np.float32)
    print(filename, "kernel", kernel_weights)
    print(filename, "bias", bias_weights)
    store_binary(kernel_weights.tobytes(), f"{filename}.kernel.bin")
    store_binary(bias_weights.tobytes(), f"{filename}.bias.bin")


def main():
    mnist = tf.keras.datasets.mnist

    (x_train, y_train), (x_test, y_test) = mnist.load_data()
    x_train, x_test = x_train / 255.0, x_test / 255.0
    # flatten
    x_train = x_train.reshape((-1, 28 * 28))
    x_test = x_test.reshape((-1, 28 * 28))

    hidden_layer = tf.keras.layers.Dense(64, activation="relu")
    output_layer = tf.keras.layers.Dense(10, activation="softmax")
    model = tf.keras.models.Sequential(
        [
            tf.keras.layers.InputLayer(input_shape=(28 * 28)),
            hidden_layer,
            # tf.keras.layers.Dropout(0.2),
            output_layer,
        ]
    )

    model.compile(
        optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"]
    )

    model.fit(x_train, y_train, epochs=5)

    model.evaluate(x_test, y_test)

    store_weights(hidden_layer, "hidden")
    store_weights(output_layer, "output")

    input_ = x_test[:1]
    store_json(input_.tolist(), "input.json")
    prediction = model.predict(input_)[0].tolist()
    store_json(prediction, "prediction.json")


if __name__ == "__main__":
    main()
