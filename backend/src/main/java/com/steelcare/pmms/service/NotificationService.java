package com.steelcare.pmms.service;

import com.steelcare.pmms.entity.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getAllNotifications();
    List<Notification> getUnreadNotifications();
    Notification markAsRead(Long id);
    Notification createNotification(String message);
}
