package isa.service.mailing;

import isa.model.EquipmentTransaction;


public interface EmailSender {
    void sendConfirmation(String to, String name, String link);
    void sendQrCode(String to, String email, EquipmentTransaction transaction);
}
