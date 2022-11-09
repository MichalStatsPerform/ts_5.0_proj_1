import { Component } from "./base-component.js";
// import { Validatable, validate } from "../util/validation.js";
import * as Validate from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler); // solution with autobind decorator
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTtile = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validate.Validatable = {
      value: enteredTtile,
      required: true,
    };
    const descriptionValidatable: Validate.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validate.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 2,
      max: 6,
    };

    if (
      !Validate.validate(titleValidatable) ||
      !Validate.validate(descriptionValidatable) ||
      !Validate.validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTtile, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    // console.log(this.titleInputElement.value); // here this is bind to current target of the event
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      console.log(title, desc, people);
      this.clearInputs();
    }
  }
}
