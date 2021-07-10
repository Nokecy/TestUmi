import styles from './index.less';
import { useMemo } from 'react';
import { Button, Input as AntInput } from 'antd';
import { createForm, onFormInit } from '@formily/core';
import {
  Form,
  FormGrid,
  FormItem,
  Select,
  Input,
  FormButtonGroup,
  Submit,
  Reset,
  FormLayout,
  FormDialog,
} from '@formily/antd';
import { createSchemaField, Field } from '@formily/react';
import useFormDialog from '@/useFormDialog';
import React from 'react';
import TestContext from '@/test';
import { Users } from '..';

export const UserContext = React.createContext({ value: 123 });

const IndexPage = (props: any) => {
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: {
          FormItem,
          FormGrid,
          Input,
          Select,
        },
      }),
    [],
  );

  const formProps = {
    effects: () => {},
  };
  const [modal, contextHolder] = useFormDialog();

  return (
    <UserContext.Provider value={{ value: 123 }}>
      <div>
        <h1 className={styles.title}>Page index</h1>
        <TestContext /> <br />
        <Button
          type={'primary'}
          onClick={() => {
            let formDialog = modal.formDialog(
              { title: 'test', width: 1200, footer: [] },
              (confirm, cancel) => {
                return (
                  <>
                    <TestContext /> <br />
                    <FormLayout
                      labelCol={6}
                      wrapperCol={18}
                      feedbackLayout={'popover'}
                      shallow={false}
                    >
                      <SchemaField>
                        <SchemaField.Void
                          x-component={'FormGrid'}
                          x-component-props={{
                            maxColumns: [1, 3, 4],
                            columnGap: 0,
                            rowGap: 0,
                          }}
                        >
                          <SchemaField.String
                            title={'Test'}
                            required
                            name={'c_ID'}
                            x-decorator="FormItem"
                            x-component={'Input'}
                          />
                        </SchemaField.Void>
                      </SchemaField>
                    </FormLayout>
                    <FormDialog.Footer>
                      <Button onClick={cancel}>取消</Button>
                      <Submit onSubmit={(values) => {}}>确定</Submit>
                    </FormDialog.Footer>
                  </>
                );
              },
            );

            formDialog.open(formProps);
          }}
        >
          测试
        </Button>
        {contextHolder}
      </div>
    </UserContext.Provider>
  );
};

IndexPage.title = 'testpage';
IndexPage.access = Users.Default;

export default IndexPage;
