package fG.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BookingInvoiceModel {

    String dateOfMeeting;

    String expertName;

    String learnerName;

    String subject;

    double actualAmount;

    double platformFees;

    double GSTFees;

    double totalAmount;

    String actualAmountWords;
}
