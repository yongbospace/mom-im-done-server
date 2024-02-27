import { ValidationArguments } from 'class-validator';

export const propertyValidationMessage = (args: ValidationArguments) => {
  return `정확한 ${args.property}를 입력해주세요.`;
};
