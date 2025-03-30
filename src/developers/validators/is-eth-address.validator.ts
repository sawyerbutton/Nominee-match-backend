import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isEthAddress', async: false })
export class IsEthAddressConstraint implements ValidatorConstraintInterface {
  validate(address: string, _args: ValidationArguments) {
    // ETH 地址格式验证
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  }

  defaultMessage(args: ValidationArguments) {
    return '无效的以太坊地址格式';
  }
}

export function IsEthAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEthAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEthAddressConstraint,
    });
  };
} 