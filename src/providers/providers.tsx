import { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { LayeredModalProvider } from '../components/molecules/modal/layered-modal';
import { SteppedProvider } from '../components/molecules/modal/stepped-modal';

import { FeatureFlagProvider } from './feature-flag-provider';
import { ImportRefresh } from './import-refresh';
import { MedusaProvider } from './medusa-provider';
import { PollingProvider } from './polling-provider';

type Props = PropsWithChildren;

/**
 * This component wraps all providers into a single component.
 */
export const Providers = ({ children }: Props) => {
  return (
    <HelmetProvider>
      <MedusaProvider>
        <FeatureFlagProvider>
          <PollingProvider>
            <ImportRefresh>
              <SteppedProvider>
                <LayeredModalProvider>{children}</LayeredModalProvider>
              </SteppedProvider>
            </ImportRefresh>
          </PollingProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </HelmetProvider>
  );
};
