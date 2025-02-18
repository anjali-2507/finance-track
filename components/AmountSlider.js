import { useState } from 'react';
import styles from '../styles/AmountSlider.module.css';

const AmountSlider = ({ onChange }) => {
    const [value, setValue] = useState(0);

    const handleChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <div className={styles.sliderContainer}>
            <input
                type="range"
                min="0"
                max="1000"
                value={value}
                onChange={handleChange}
                className={styles.slider}
            />
            <div className={styles.sliderValue}>
                Amount: ${value}
            </div>
        </div>
    );
};

export default AmountSlider; 