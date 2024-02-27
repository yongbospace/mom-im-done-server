import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length === 2) {
    return `${args.property} : ${args.constraints[0]} ~ ${args.constraints[1]} 글자를 입력하세요.`;
  } else {
    return `${args.property} : ${args.constraints[0]}글자 이상 입력하세요.`;
  }
};
