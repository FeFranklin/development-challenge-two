import './App.scss';
import { Form, ListModal } from './components';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {

  return (
    <div className='container__image'>
      <Form />
      <ListModal />
    </div>
  )
}

export default App;
