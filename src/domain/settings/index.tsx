import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";

import SettingsCard from "../../components/atoms/settings-card";
import Spacer from "../../components/atoms/spacer";
import FeatureToggle from "../../components/fundamentals/feature-toggle";
import GearIcon from "../../components/fundamentals/icons/gear-icon";
import HappyIcon from "../../components/fundamentals/icons/happy-icon";
import UsersIcon from "../../components/fundamentals/icons/users-icon";
import MailIcon from "../../components/fundamentals/icons/mail-icon";

import UserEdit from "./users/details";
import PersonalInformation from "./personal-information";
import Users from "./users";
import { helpEmail } from "../../utils/email";
import ShippingOptions from "./shipping-options";
import TruckIcon from "../../components/fundamentals/icons/truck-icon";
import CoinsIcon from "../../components/fundamentals/icons/coins-icon";
import CurrencySettings from "./currencies";

type SettingsCardType = {
  heading: string;
  description: string;
  icon?: React.ComponentType;
  to?: string;
  feature_flag?: string;
  externalLink?: string;
};

const settings: SettingsCardType[] = [
  {
    heading: "Personal Information",
    description: "Manage your profile",
    icon: HappyIcon,
    to: "/a/settings/personal-information",
  },
  {
    heading: "The Team",
    description: "Manage users of your Store",
    icon: UsersIcon,
    to: "/a/settings/team",
  },
  {
    heading: "Currencies",
    description: "Manage the currencies of your store",
    icon: CoinsIcon,
    to: "/a/settings/currencies",
  },
  {
    heading: "Shipping Options",
    description: "Manage shipping options in your Store",
    icon: TruckIcon,
    to: "/a/settings/shipping-options",
  },
  {
    heading: "hello@mercurjs.com",
    description: "Can’t find the answers you’re looking for? Email us!",
    icon: MailIcon,
    externalLink: `mailto:${helpEmail}`,
  },
];

const renderCard = ({
  heading,
  description,
  icon,
  to,
  feature_flag,
  externalLink,
}: SettingsCardType) => {
  const Icon = icon || GearIcon;

  const card = (
    <SettingsCard
      heading={heading}
      description={description}
      icon={<Icon />}
      to={to}
      externalLink={externalLink}
    />
  );

  if (feature_flag) {
    return <FeatureToggle featureFlag={feature_flag}>{card}</FeatureToggle>;
  }

  return card;
};

const SettingsIndex = () => {
  const { t } = useTranslation();

  return (
    <div className="gap-y-xlarge flex flex-col">
      <div className="gap-y-large flex flex-col">
        <div className="gap-y-2xsmall flex flex-col">
          <h2 className="inter-large-semibold large:inter-xlarge-semibold">
            General
          </h2>
          <p className="inter-base-regular text-grey-50">
            {t(
              "settings-manage-the-general-settings-for-your-store",
              "Manage the general settings for your store"
            )}
          </p>
        </div>
        <div className="medium:grid-cols-2 gap-y-xsmall grid grid-cols-1 gap-x-4">
          {settings.map((s) => renderCard(s))}
        </div>
      </div>
      <Spacer />
    </div>
  );
};

const Settings = () => {
  return (
    <Routes>
      <Route index element={<SettingsIndex />} />
      <Route path="/team" element={<Users />} />
      <Route path="/team/:id" element={<UserEdit />} />
      <Route path="/shipping-options/*" element={<ShippingOptions />} />
      <Route path="/personal-information" element={<PersonalInformation />} />
      <Route path="/currencies" element={<CurrencySettings />} />
    </Routes>
  );
};

export default Settings;
