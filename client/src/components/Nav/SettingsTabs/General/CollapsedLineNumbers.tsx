import InputNumber from 'rc-input-number';
import { useRecoilState } from 'recoil';
import { Input, Switch } from '~/components/ui';
import { useLocalize } from '~/hooks';
import store from '~/store';
import { cn, optionText, defaultTextProps, removeFocusOutlines } from '~/utils/';

export default function CollapsedLineNumbers({
  onCheckedChange,
}: {
  onCheckedChange?: (value: boolean) => void;
}) {
  const [autoScroll, setAutoScroll] = useRecoilState<boolean>(store.autoScroll);
  const localize = useLocalize();

  const handleCheckedChange = (value: boolean) => {
    setAutoScroll(value);
    if (onCheckedChange) {
      onCheckedChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div> {localize('com_nav_collapsed_line_numbers')} </div>
      <InputNumber
        id="top-p-int"
        min={0}
        step={1}
        controls={false}
        className={cn(
          defaultTextProps,
          cn(
            optionText,
            'reset-rc-number-input reset-rc-number-input-text-right h-auto w-12 border-0 group-hover/temp:border-gray-200',
          ),
        )}
      />
    </div>
  );
}
