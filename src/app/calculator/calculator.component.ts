import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  value: { active: boolean, value: string } = { active: false, value: "0" };
  result: string = "0";
  dialog: boolean = false;

  THEME: string = "Theme";
  AC: string = "AC";
  D: string = "D";
  EQUALS: string = "=";
  ZERO: string = "0";

  operationSign = "+-x÷";
  multiplicationDivision = "x÷";
  additionSubstraction = "+-";
  numbers: string = "0123456789";

  buttons: string[][] = [
    [this.AC, this.D, "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    [this.THEME, this.ZERO, ",", this.EQUALS]
  ]

  themes: string[] = [
    "Light",
    "Dark",
    "MehmetSpecialDesign",
    "Spring",
    "Blue",
  ]

  constructor() { }

  ngOnInit(): void {
  }

  click(button: string) {
    switch (button) {
      case this.THEME:
        this.theme();
        break;
      case this.AC:
        this.result = this.ZERO;
        this.value.active = false;
        break;
      case this.D:
        this.delete();
        break;
      case this.EQUALS:
        this.equalsButton();
        break;
      case "%":
        this.percent();
        break;
      case ",":
        if (this.result == this.ZERO)
          this.result = `${this.ZERO}.`
        else
          this.result = this.result + ".";
        break;
      default:
        this.operation(button);
        break;
    }
  }
  equalsButton() {
    if (this.result == this.ZERO) return;
    this.value.active = true
    this.value.value = this.calculate(this.result);
  }

  delete() {
    if (this.result.length > 0 && this.result !== this.ZERO) {
      this.result = this.result.substring(0, this.result.length - 1);
      if (this.result.length == 0)
        this.result = this.ZERO;
      this.value.active = false;
    }
  }
  operation(button: string) {
    if (this.value.active && this.operationSign.includes(button)) {
      this.result = this.value.value;
      this.value.active = false;
    }
    if (this.value.active && !this.operationSign.includes(button)) {
      this.result = this.ZERO
      this.value.active = false;
    }

    if (this.result == this.ZERO) {
      if (this.operationSign.includes(button) && !this.additionSubstraction.includes(button)) return;
      this.result = button;
    } else {
      if (this.operationSign.includes(this.result[this.result.length - 1])) {
        if (this.operationSign.includes(button)) {
          this.result = this.result.substring(0, this.result.length - 1) + button;
          return;
        }
      }
      this.result = this.result + button
    }
  }
  theme() {
    this.dialog = true;
  }
  closeDialog() {
    this.dialog = false;
  }
  selectTheme(themeName: string) {
    document.documentElement.setAttribute('data-theme', themeName);
    this.dialog = false;
  }

  percent() {
    let value: null | number = null;
    let number = 0;
    if (this.operationSign.includes(this.result[this.result.length - 1])) {
      return;
    }
    for (let i = this.result.length - 1; i > 0; i--) {
      if (this.operationSign.includes(this.result[i])) {
        value = i;
        break;
      }
    }
    if (value != null) {
      number = Number(this.result.substring(value + 1, this.result.length))
      this.result = this.result.substring(0, value + 1) + String(number / 100)
    } else {
      number = Number(this.result)
      this.result = String(number / 100);
    }
  }
  buttonColor(button: string): string {
    if (!this.numbers.includes(button)) {
      switch (button) {
        case ",":
          return "";
        case this.EQUALS:
          return "equal-sign-button"
        default:
          return "other-button";
      }
    }
    return "";
  }
  calculate(resultValue: string) {
    var calculated = false;
    let value = 0;
    let array = this.operationSignFind(resultValue);
    while (!calculated) {
      if (this.multiplicationDivision.includes(array[1])) {
        value = this.process(array[0], array[1], array[2])
        array.splice(0, 3, String(value));
      } else {
        if (this.multiplicationDivision.includes(array[3])) {
          value = this.process(array[2], array[3], array[4])
          array.splice(2, 3, String(value));
        } else {
          value = this.process(array[0], array[1], array[2])
          array.splice(0, 3, String(value));
        }
      }
      if (!this.operationSign.includes(array[1])) {
        calculated = true;
      }
    }
    return array[0];
  }

  operationSignFind(resultValue: string) {
    let array: string[] = [];
    let endValue = 0;
    for (let i = 1; i < resultValue.length; i++) {
      if (this.operationSign.includes(resultValue[i])) {
        array[array.length] = (resultValue.substring(endValue == 0 ? endValue : endValue + 1, i))
        endValue = i;
        array[array.length] = (resultValue[i])
      }
    }
    array[array.length] = resultValue.substring(endValue + 1, resultValue.length)
    return array;
  }

  process(firstNumber: string, operation: string, secondNumber: string): number {
    switch (operation) {
      case "x":
        return Number(firstNumber) * Number(secondNumber);
      case "÷":
        return Number(firstNumber) / Number(secondNumber);
      case "+":
        return Number(firstNumber) + Number(secondNumber);
      case "-":
        return Number(firstNumber) - Number(secondNumber);
      default:
        return 0;
    }
  }

}
