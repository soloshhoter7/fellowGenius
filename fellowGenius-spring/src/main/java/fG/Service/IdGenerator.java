package fG.Service;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Random;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

public class IdGenerator extends SequenceStyleGenerator{
	    Random r = new Random();
	    Session session;

	    public int generate9DigitNumber()
	    {
	        int aNumber = (int) ((Math.random() * 900000000) + 100000000); 
	        return aNumber;
	    }

	    @Override
	    public Serializable generate(SharedSessionContractImplementor session,
	            Object object) throws HibernateException {
	          return generate9DigitNumber();
	    }
}
