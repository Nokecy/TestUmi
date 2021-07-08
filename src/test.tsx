import { useContext } from 'react';
import { UserContext } from './pages';

const TestContext = (props) => {
  const { value } = useContext(UserContext);

  return <span>context 值 {value}</span>;
};

export default TestContext;
