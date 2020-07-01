import React, { useState } from "react";
import Lottie from "react-lottie";
import { Container } from "./styles";

import animationData from "../../assets/25920-questions.json";

const Animation: React.FC = () => {
    const [autoplay] = useState(false);
    const [loop] = useState(true);
    const [direction] = useState(1);

    return (
        <Container>
            <Lottie
                options={{
                    loop: loop,
                    autoplay: autoplay,
                    animationData: animationData,
                }}

                direction={direction}
            />
        </Container>
    );
};

export default Animation;
