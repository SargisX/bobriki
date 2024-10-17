import { useState, useEffect } from "react"
import styles from "./calculator.module.css"

export const Calculator = () => {
    const [display, setDisplay] = useState("0")
    const [operator, setOperator] = useState<string | null>(null)
    const [firstOperand, setFirstOperand] = useState<number | null>(null)
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false)

    const handleNumberClick = (value: string) => {
        if (waitingForSecondOperand) {
            setDisplay(value)
            setWaitingForSecondOperand(false)
        } else {
            setDisplay(display === "0" ? value : display + value)
        }
    }

    const handleOperatorClick = (nextOperator: string) => {
        const inputValue = parseFloat(display)
        if (firstOperand === null) {
            setFirstOperand(inputValue)
        } else if (operator) {
            const result = performCalculation(firstOperand, inputValue, operator)
            setDisplay(String(result))
            setFirstOperand(result)
        }

        setOperator(nextOperator)
        setWaitingForSecondOperand(true)
    }

    const performCalculation = (first: number, second: number, operator: string) => {
        switch (operator) {
            case "+":
                return first + second
            case "-":
                return first - second
            case "x":
                return first * second
            case "÷":
                return second !== 0 ? first / second : NaN
            default:
                return second
        }
    }

    const handleEqualClick = () => {
        if (operator && firstOperand !== null) {
            const secondOperand = parseFloat(display)
            const result = performCalculation(firstOperand, secondOperand, operator)
            setDisplay(String(result))
            setFirstOperand(null)
            setOperator(null)
            setWaitingForSecondOperand(false)
        }
    }

    const handleClearClick = () => {
        setDisplay("0")
        setFirstOperand(null)
        setOperator(null)
        setWaitingForSecondOperand(false)
    }

    const handlePlusMinusClick = () => {
        setDisplay(String(parseFloat(display) * -1))
    }

    const handlePercentageClick = () => {
        setDisplay(String(parseFloat(display) / 100))
    }


    const handleKeyDown = (event: KeyboardEvent) => {
        const { key } = event
        if (key >= "0" && key <= "9") {
            handleNumberClick(key)
        } else if (key === "+" || key === "-" || key === "*" || key === "/") {
            const operatorsMap: { [key: string]: string } = { "*": "x", "/": "÷", "+": "+", "-": "-" }
            handleOperatorClick(operatorsMap[key] || key)
        } else if (key === "Enter" || key === "=") {
            handleEqualClick()
        } else if (key === "Escape") {
            handleClearClick()
        } else if (key === "%") {
            handlePercentageClick()
        } else if (key === ".") {
            if (!display.includes(".")) {
                handleNumberClick(".")
            }
        }
    }


    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [display, operator, firstOperand, waitingForSecondOperand])

    return (
        <div className={styles.calculatorContainer}>
            <div className={styles.calculator}>
                <div className={styles.calculatorScreenDiv}>
                    <div className={styles.calculatorScreen}>
                        <div className={styles.calculatorDisplayValue}>{display}</div>
                    </div>
                </div>
                <div className={styles.calcConfig}>
                    <div className={styles.calculatorButtons}>
                        <button className={styles.calculatorButton} onClick={handleClearClick}>C</button>
                        <button className={styles.calculatorButton} onClick={handlePlusMinusClick}>+/-</button>
                        <button className={styles.calculatorButton} onClick={handlePercentageClick}>%</button>
                        <button className={`${styles.calculatorButton} ${styles.calculatorButtonOperator}`} onClick={() => handleOperatorClick("÷")}>➗</button>

                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("7")}>7</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("8")}>8</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("9")}>9</button>
                        <button className={`${styles.calculatorButton} ${styles.calculatorButtonOperator}`} onClick={() => handleOperatorClick("x")}>x</button>

                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("4")}>4</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("5")}>5</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("6")}>6</button>
                        <button className={`${styles.calculatorButton} ${styles.calculatorButtonOperator}`} onClick={() => handleOperatorClick("-")}>-</button>

                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("1")}>1</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("2")}>2</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick("3")}>3</button>
                        <button className={`${styles.calculatorButton} ${styles.calculatorButtonOperator}`} onClick={() => handleOperatorClick("+")}>+</button>

                        <button className={`${styles.calculatorButton} ${styles.calculatorButtonSpecial}`} onClick={() => handleNumberClick("0")}>0</button>
                        <button className={styles.calculatorButton} onClick={() => handleNumberClick(".")}>.</button>
                        <button className={`${styles.calculatorButton} ${styles.calculatorButtonEqual}`} onClick={handleEqualClick}>=</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
