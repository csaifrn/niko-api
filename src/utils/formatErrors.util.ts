import { ValidationError } from '@nestjs/common';

export const formatErrors = (messages: ValidationError[]) => {
  const formatedMessages = messages.map((msg) => ({
    value: msg.value,
    field: msg.property,
    error_msg: Object.values(msg.constraints)[0],
  }));

  return formatedMessages;
};
