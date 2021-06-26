import styles from './index.less';
import {
  createForm
} from '@formily/core';
import {
  Form,
  FormGrid,
  FormItem,
  Select,
  Input,
  FormButtonGroup,
  Submit,
  Reset
} from '@formily/antd';
import { useForm } from 'antd/es/form/Form';

export default function IndexPage() {
  const form = createForm();
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>

      <Form
        form={form}
        feedbackLayout={'none'}
        layout={'horizontal'}
        labelCol={8}
        style={{ backgroundColor: '#fff', padding: 10, marginBottom: 8 }}
      >
        <FormGrid
          rowGap={0}
          columnGap={10}
        >

        </FormGrid>
      </Form>
    </div>
  );
}
