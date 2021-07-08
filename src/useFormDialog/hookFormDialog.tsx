import * as React from 'react';
import { Modal } from 'antd';
import { FormProvider } from '@formily/react';
import { isFn } from '@formily/shared';

const HookFormDialog: React.ForwardRefRenderFunction<any, any> = (
  { afterClose, modalProps, content },
  ref,
) => {
  const [innerConfig, setInnerConfig] = React.useState(modalProps);

  const { form, resolve, reject, ...restConfig } = innerConfig;

  function close(...args: any[]) {
    setInnerConfig((originConfig) => ({
      ...originConfig,
      ...{ visible: false },
    }));
    const triggerCancel = args.some((param) => param && param.triggerCancel);
    if (restConfig.onCancel && triggerCancel) {
      restConfig.onCancel();
    }
  }

  React.useImperativeHandle(ref, () => ({
    destroy: close,
    update: (newConfig: any) => {
      setInnerConfig((originConfig) => ({
        ...originConfig,
        ...newConfig,
      }));
    },
  }));

  const component = (props) => {
    return (
      <React.Fragment>
        {isFn(props.content) ? content(props.resolve, props.reject) : content}
      </React.Fragment>
    );
  };

  return (
    <Modal {...restConfig} onCancel={close} afterClose={afterClose}>
      <FormProvider form={form}>
        {React.createElement(component, {
          content,
          resolve,
          reject,
        })}
      </FormProvider>
    </Modal>
  );
};

export default React.forwardRef(HookFormDialog);
