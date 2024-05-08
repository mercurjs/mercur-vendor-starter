import { Heading, Text } from '@medusajs/ui';

import AnalyticsCard from '../../components/molecules/analytics-card';

const data = [
  {
    revenue: 10400,
    date: new Date().toString(),
  },
  {
    revenue: 14405,
    date: new Date().toString(),
  },
  {
    revenue: 9400,
    date: new Date().toString(),
  },
  {
    revenue: 8200,
    date: new Date().toString(),
  },
  {
    revenue: 7000,
    date: new Date().toString(),
  },
  {
    revenue: 9600,
    date: new Date().toString(),
  },
  {
    revenue: 11244,
    date: new Date().toString(),
  },
  {
    revenue: 26475,
    date: new Date().toString(),
  },
  {
    revenue: 26475,
    date: new Date().toString(),
  },
  {
    revenue: 26475,
    date: new Date().toString(),
  },
  {
    revenue: 11244,
    date: new Date().toString(),
  },
];

const Overview = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-xlarge">
        <div>
          <Heading className="inter-2xlarge-semibold mb-xsmall font-bold">
            Your overview
          </Heading>
          <Text className="text-ui-fg-subtle">
            Here&apos;s an overview of your products.
          </Text>
        </div>
      </div>
      <div className="flex gap-4">
        <AnalyticsCard
          dataKey="revenue"
          title="Total customers"
          data={data}
          tooltipContent="The total number of customers who have made a purchase in the selected time range"
          value={240}
          increase="+5%"
          fromDate={new Date()}
          toDate={new Date()}
        />
        <AnalyticsCard
          dataKey="revenue"
          title="Total customers"
          data={data}
          tooltipContent="The total number of customers who have made a purchase in the selected time range"
          value={240}
          decrease="-55%"
          fromDate={new Date()}
          toDate={new Date()}
        />
        <AnalyticsCard
          dataKey="revenue"
          title="MMR"
          tooltipContent="None"
          value={500}
        />
      </div>
    </>
  );
};

export default Overview;
