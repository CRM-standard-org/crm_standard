import { useParams } from 'react-router-dom';
import CustomerStatusForm from '@/features/Customer/customer-status-form';

export default function EditCustomerStatusPage(){
  const { customerStatusId } = useParams();
  return <CustomerStatusForm mode='edit' id={customerStatusId} />;
}
