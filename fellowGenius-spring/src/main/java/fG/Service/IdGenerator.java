package fG.Service;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import java.io.Serializable;

public class IdGenerator extends SequenceStyleGenerator{
	    public int generate9DigitNumber()
	    {
			return (int) ((Math.random() * 900000000) + 100000000);
	    }

	    @Override
	    public Serializable generate(SharedSessionContractImplementor session,
	            Object object) throws HibernateException {
	          return generate9DigitNumber();
	    }
}
