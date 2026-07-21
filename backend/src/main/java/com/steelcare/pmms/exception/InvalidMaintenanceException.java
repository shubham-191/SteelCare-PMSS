package com.steelcare.pmms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidMaintenanceException extends RuntimeException {
    public InvalidMaintenanceException(String message) {
        super(message);
    }
}
