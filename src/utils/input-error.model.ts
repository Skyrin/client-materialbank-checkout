type standardValidatorKey = "required" | "number" | "eail";
// You can add more validators here and their respective validation methods, to suit your needs (i.e. email, card number, date etc.)

export class InputErrorModel {
  public errorText: string = "";
  private readonly standardValidators: standardValidatorKey[];
  private readonly customValidator: (value: any, context?: any) => string; // Must return the error text.
  private readonly standardValidatorsMap: Map<
    standardValidatorKey,
    (value: any) => string
  > = new Map([["required", this.validateRequired]]);

  constructor(
    standardValidators?: standardValidatorKey[],
    customValidator?: (value: any, context?: any) => string
  ) {
    this.standardValidators = standardValidators;
    this.customValidator = customValidator;
  }

  private validateRequired(value: string | number): string {
    if (!value && value !== 0) {
      return "Required";
    }
    return null;
  }

  private validateNumber(value: string | number): string {
    if (isNaN(parseInt(value as string, 10))) {
      return "Needs to be a valid number";
    }
    return null;
  }

  private validateEmail(value: string | number): string {
    if (isNaN(parseInt(value as string, 10))) {
      return "Needs to be a valid number";
    }
    return null;
  }

  public validate(value: any, context?: any): void {
    console.log(context.data);
    this.errorText = "";
    let standardError = null;
    let customError = null;

    if (this.standardValidators?.length) {
      this.standardValidators.forEach((key: standardValidatorKey) => {
        standardError = this.standardValidatorsMap.get(key)(value);
        if (standardError) {
          return;
        }
      });
    }

    if (this.customValidator) {
      customError = this.customValidator(value, context);
    }

    if (standardError) {
      this.errorText = standardError;
    } else if (customError) {
      this.errorText = customError;
    } else {
      this.errorText = null;
    }
  }
}

export type FormErrorsModel = { [key: string]: InputErrorModel };
