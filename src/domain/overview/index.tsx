import { Route, Routes } from 'react-router-dom';

import Overview from './overview';

const OverviewRoute = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
    </Routes>
  );
};

export default OverviewRoute;
