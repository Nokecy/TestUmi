import { createForm } from '@formily/core';
import * as React from 'react';
import HookFormDialog from './hookFormDialog';

function usePatchElement(): [
  React.ReactElement[],
  (element: React.ReactElement) => Function,
] {
  const [elements, setElements] = React.useState<React.ReactElement[]>([]);

  const patchElement = React.useCallback((element: React.ReactElement) => {
    // append a new element to elements (and create a new ref)
    setElements((originElements) => [...originElements, element]);

    // return a function that removes the new element out of elements (and create a new ref)
    // it works a little like useEffect
    return () => {
      setElements((originElements) =>
        originElements.filter((ele) => ele !== element),
      );
    };
  }, []);

  return [elements, patchElement];
}

let uuid = 0;

interface ElementsHolderRef {
  patchElement: ReturnType<typeof usePatchElement>[1];
}

const ElementsHolder = React.memo(
  React.forwardRef<ElementsHolderRef>((_props, ref) => {
    const [elements, patchElement] = usePatchElement();
    React.useImperativeHandle(
      ref,
      () => ({
        patchElement,
      }),
      [],
    );
    return <>{elements}</>;
  }),
);

interface ModalProps {
  formDialog: (
    modalProps: any,
    content: any,
  ) => {
    open: (props: Formily.Core.Types.IFormProps) => null;
    close: () => void;
  };
}

export default function useModal(): [ModalProps, React.ReactElement] {
  const holderRef = React.useRef<ElementsHolderRef>(null as any);

  // ========================== Effect ==========================
  const [actionQueue, setActionQueue] = React.useState<(() => void)[]>([]);

  React.useEffect(() => {
    if (actionQueue.length) {
      const cloneQueue = [...actionQueue];
      cloneQueue.forEach((action) => {
        action();
      });

      setActionQueue([]);
    }
  }, [actionQueue]);

  // =========================== Hook ===========================
  const getConfirmFunc = React.useCallback(
    () =>
      function hookConfirm(modalProps: any, content: any) {
        uuid += 1;

        const env = {
          root: document.createElement('div'),
          form: null,
          promise: null,
        };

        const modalRef = React.createRef<any>();

        let closeFunc: Function;

        const modal = (
          <HookFormDialog
            key={`modal-${uuid}`}
            modalProps={modalProps}
            content={content}
            ref={modalRef}
            afterClose={() => {
              closeFunc();
            }}
          />
        );

        closeFunc = holderRef.current?.patchElement(modal);

        const update = (newConfig) => {
          function updateAction() {
            modalRef.current?.update(newConfig);
          }

          if (modalRef.current) {
            updateAction();
          } else {
            setActionQueue((prev) => [...prev, updateAction]);
          }
        };

        const close = () => {
          if (!env.root) return;
          function destroyAction() {
            modalRef.current?.destroy();
          }

          if (modalRef.current) {
            destroyAction();
          } else {
            setActionQueue((prev) => [...prev, destroyAction]);
          }
        };

        return {
          open: (props: Formily.Core.Types.IFormProps) => {
            if (env.promise) return env.promise;
            env.form = env.form || createForm(props);
            env.promise = new Promise((resolve) => {
              update({
                visible: true,
                form: env.form,
                resolve: () => {
                  env.form.submit((values: any) => {
                    resolve(values);
                    close();
                  });
                },
                reject: () => {
                  function destroyAction() {
                    modalRef.current?.destroy();
                  }

                  if (modalRef.current) {
                    destroyAction();
                  } else {
                    setActionQueue((prev) => [...prev, destroyAction]);
                  }
                },
              });
            });
            return env.promise;
          },
          close: close,
        };
      },
    [],
  );

  const fns = React.useMemo(
    () => ({
      formDialog: getConfirmFunc(),
    }),
    [],
  );

  // eslint-disable-next-line react/jsx-key
  return [fns, <ElementsHolder ref={holderRef} />];
}
