'use client';

import type { Message } from '@/lib/types';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import {SparklesIcon, UserIcon} from './icons';
import { cn } from '@/lib/utils';

const PurePreviewMessage = ({
  message,
}: {
  message: Message;
}) => {
  const [mode] = useState<'view' | 'edit'>('view');

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=sender]/message:ml-auto group-data-[role=sender]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=sender]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'receiver' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <UserIcon />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">

            {message.content && mode === 'view' && (
              <div className="flex flex-row gap-2 items-start">

                <div
                  className={cn('flex flex-col gap-4 px-3 py-2 rounded-xl', {
                    'bg-primary text-primary-foreground': message.role === 'sender',
                    'ring-border ring-1': message.role === 'receiver',
                  })}
                >
                  {message.content as string}
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    // if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    // if (
    //   !equal(
    //     prevProps.message.toolInvocations,
    //     nextProps.message.toolInvocations,
    //   )
    // )
    //   return false;
    // if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
