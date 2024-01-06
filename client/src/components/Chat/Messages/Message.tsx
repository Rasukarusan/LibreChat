import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Plugin } from '~/components/Messages/Content';
import MessageContent from './Content/MessageContent';
import type { TMessageProps } from '~/common';
import SiblingSwitch from './SiblingSwitch';
import { useMessageHelpers } from '~/hooks';
// eslint-disable-next-line import/no-cycle
import MultiMessage from './MultiMessage';
import HoverButtons from './HoverButtons';
import SubRow from './SubRow';
import { cn } from '~/utils';

export default function Message(props: TMessageProps) {
  const { message, siblingIdx, siblingCount, setSiblingIdx, currentEditId, setCurrentEditId } =
    props;

  const {
    ask,
    icon,
    edit,
    isLast,
    enterEdit,
    handleScroll,
    conversation,
    isSubmitting,
    latestMessage,
    handleContinue,
    copyToClipboard,
    regenerateMessage,
    isExpand,
    setIsExpand,
  } = useMessageHelpers(props);

  const { text, children, messageId = null, isCreatedByUser, error, unfinished } = message ?? {};
  const messageRef = useRef<HTMLDivElement>(null);
  const [showExpand, setShowExpand] = useState(false);
  useEffect(() => {
    console.log(messageRef.current?.textContent);
    // メッセージエレメントの高さを取得して行数を計算する
    const calculateLines = () => {
      if (!messageRef.current) {
        return 1;
      }
      const messageHeight = messageRef.current.clientHeight;
      const lineHeight = parseInt(window.getComputedStyle(messageRef.current).lineHeight);
      const lines = Math.floor(messageHeight / lineHeight);
      return lines;
    };
    const lines = calculateLines();
    if (lines > 3) {
      setShowExpand(true);
    } else {
      setShowExpand(false);
      setIsExpand(true);
    }
    console.log(lines);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <>
      <div
        className="text-token-text-primary w-full border-0 bg-transparent dark:border-0 dark:bg-transparent"
        onWheel={handleScroll}
        onTouchMove={handleScroll}
      >
        <div className="m-auto justify-center p-4 py-2 text-base md:gap-6">
          <div className="group mx-auto flex flex-1 gap-3 text-base md:max-w-3xl md:px-5 lg:max-w-[40rem] lg:px-1 xl:max-w-[48rem] xl:px-5">
            <div className="relative flex flex-shrink-0 flex-col items-end">
              <div>
                <div className="pt-0.5">
                  <div className="gizmo-shadow-stroke flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                    {typeof icon === 'string' && /[^\\x00-\\x7F]+/.test(icon as string) ? (
                      <span className=" direction-rtl w-40 overflow-x-scroll">{icon}</span>
                    ) : (
                      icon
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={cn('relative w-full flex-col', isCreatedByUser ? '' : 'agent-turn')}>
              <div className="flex select-none items-center justify-between font-semibold ">
                {isCreatedByUser ? 'You' : message.sender}
                {isCreatedByUser && !edit && showExpand && (
                  <button
                    className="rounded-full p-1 hover:bg-gray-100 hover:brightness-110 dark:hover:bg-gray-700"
                    onClick={() => setIsExpand(!isExpand)}
                  >
                    {isExpand ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                )}
              </div>
              <div className="flex-col gap-1 md:gap-3">
                <div
                  ref={messageRef}
                  className={cn(
                    'flex max-w-full flex-grow flex-col gap-0',
                    isCreatedByUser && !edit && showExpand
                      ? 'h-[120px] cursor-pointer brightness-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : '',
                    !isCreatedByUser || isExpand || edit
                      ? 'h-auto'
                      : 'readmore-blur overflow-hidden',
                  )}
                  onClick={() => setIsExpand(!isExpand)}
                >
                  {/* Legacy Plugins */}
                  {message?.plugin && <Plugin plugin={message?.plugin} />}
                  <MessageContent
                    ask={ask}
                    edit={edit}
                    isLast={isLast}
                    text={text ?? ''}
                    message={message}
                    enterEdit={enterEdit}
                    error={!!error}
                    isSubmitting={isSubmitting}
                    unfinished={unfinished ?? false}
                    isCreatedByUser={isCreatedByUser ?? true}
                    siblingIdx={siblingIdx ?? 0}
                    setSiblingIdx={
                      setSiblingIdx ??
                      (() => {
                        return;
                      })
                    }
                  />
                </div>
              </div>
              <div className="">
                {isLast && isSubmitting ? null : (
                  <SubRow classes="text-xs">
                    <SiblingSwitch
                      siblingIdx={siblingIdx}
                      siblingCount={siblingCount}
                      setSiblingIdx={setSiblingIdx}
                    />
                    <HoverButtons
                      isEditing={edit}
                      message={message}
                      enterEdit={enterEdit}
                      isSubmitting={isSubmitting}
                      conversation={conversation ?? null}
                      regenerate={() => regenerateMessage()}
                      copyToClipboard={copyToClipboard}
                      handleContinue={handleContinue}
                      latestMessage={latestMessage}
                    />
                  </SubRow>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MultiMessage
        key={messageId}
        messageId={messageId}
        conversation={conversation}
        messagesTree={children ?? []}
        currentEditId={currentEditId}
        setCurrentEditId={setCurrentEditId}
      />
    </>
  );
}
