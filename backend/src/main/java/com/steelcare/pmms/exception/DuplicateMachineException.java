package com.steelcare.pmms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DuplicateMachineException extends RuntimeException {
    public DuplicateMachineException(String message) {
        super(message);
    }
}
