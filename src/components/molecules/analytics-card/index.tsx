import {
  ArrowDownMini,
  ArrowUpMini,
  InformationCircleSolid,
} from '@medusajs/icons';
import { Heading, Text, Tooltip } from '@medusajs/ui';
import moment from 'moment';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';

type AnalyticsChartCardProps = {
  title: string;
  value: string | number;
  tooltipContent: string;
  data?: any[];
  increase?: string;
  decrease?: string;
  dataKey: string;
  fromDate?: Date;
  toDate?: Date;
};

const AnalyticsCard = (props: AnalyticsChartCardProps) => {
  const {
    title,
    tooltipContent,
    value,
    data,
    increase,
    decrease,
    dataKey,
    fromDate,
    toDate,
  } = props;

  const TimeLine = () =>
    fromDate && toDate ? (
      <div className="flex items-center justify-between">
        <Text className="text-ui-fg-subtle" size="small">
          {moment(fromDate).format('DD MMM, YYYY')}
        </Text>
        <Text className="text-ui-fg-subtle" size="small">
          {moment(toDate).format('DD MMM, YYYY')}
        </Text>
      </div>
    ) : null;

  const AggregationProcent = () => {
    if (increase) {
      return (
        <div className="bg-ui-tag-green-bg flex py-1 px-2 rounded-lg gap-0.5">
          <Text size="small" className="text-ui-tag-green-icon">
            {increase}
          </Text>
          <ArrowUpMini className="text-ui-tag-green-icon" />
        </div>
      );
    }

    if (decrease) {
      return (
        <div className="bg-ui-tag-red-bg flex py-1 px-2 rounded-lg gap-0.5">
          <Text size="small" className="text-ui-tag-red-icon">
            {decrease}
          </Text>
          <ArrowDownMini className="text-ui-tag-red-icon" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-ui-bg-base min-w-[320px] rounded-2xl border border-ui-border-base p-5 pb-3 h-min">
      <div className="flex items-center gap-2">
        <Heading level="h2">{title}</Heading>
        <Tooltip content={tooltipContent}>
          <InformationCircleSolid className="text-ui-fg-subtle" />
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <Heading className="inter-3xlarge-semibold leading-snug">
          {value}
        </Heading>
        <AggregationProcent />
      </div>
      {data ? (
        <>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey={dataKey}
                style={
                  {
                    stroke: 'rgba(59, 130, 246, 1)',
                  } as React.CSSProperties
                }
              />
              <RechartsTooltip content={CustomTooltip} />
            </LineChart>
          </ResponsiveContainer>
          <TimeLine />
        </>
      ) : null}
    </div>
  );
};

const CustomTooltip: ContentType<any, any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ui-bg-base p-2 rounded-lg shadow-md text-ui-fg-subtle">
        <p>{moment(payload[0].payload.date).format('DD MMM, YYYY')}</p>
        <p>{`${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default AnalyticsCard;
