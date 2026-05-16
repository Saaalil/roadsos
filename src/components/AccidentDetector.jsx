import { useEffect } from "react";

function AccidentDetector({ activateSOS }) {

    useEffect(() => {

        function detect(event) {

            const x = event.accelerationIncludingGravity?.x || 0;
            const y = event.accelerationIncludingGravity?.y || 0;
            const z = event.accelerationIncludingGravity?.z || 0;

            const total = Math.sqrt(
                x * x + y * y + z * z
            );

            if (total > 35) {

                alert("🚨 Possible Accident Detected");

                activateSOS();

            }

        }

        window.addEventListener(
            "devicemotion",
            detect
        );

        return () => {

            window.removeEventListener(
                "devicemotion",
                detect
            )

        }

    }, [activateSOS]);

    return null;

}

export default AccidentDetector;