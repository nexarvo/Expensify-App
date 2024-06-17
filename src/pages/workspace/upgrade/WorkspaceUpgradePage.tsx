import type {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {useOnyx} from 'react-native-onyx';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import useNetwork from '@hooks/useNetwork';
import Navigation from '@libs/Navigation/Navigation';
import type {SettingsNavigatorParamList} from '@libs/Navigation/types';
import NotFoundPage from '@pages/ErrorPage/NotFoundPage';
import CONST from '@src/CONST';
import * as Policy from '@src/libs/actions/Policy/Policy';
import type SCREENS from '@src/SCREENS';
import UpgradeConfirmation from './UpgradeConfirmation';
import UpgradeIntro from './UpgradeIntro';

type WorkspaceUpgradePageProps = StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.UPGRADE>;

function WorkspaceUpgradePage({route}: WorkspaceUpgradePageProps) {
    const policyID = route.params.policyID;
    const featureName = route.params.featureName as keyof typeof CONST.UPGRADE_FEATURE_INTRO_MAPPING;
    const feature = CONST.UPGRADE_FEATURE_INTRO_MAPPING[featureName as keyof typeof CONST.UPGRADE_FEATURE_INTRO_MAPPING];
    const {translate} = useLocalize();
    const [policy] = useOnyx(`policy_${policyID}`);
    const {isOffline} = useNetwork();

    if (!feature || !policy) {
        return <NotFoundPage />;
    }

    const upgradeToCorporate = () => {
        Policy.upgradeToCorporate(policy.id, featureName);
    };

    const isUpgraded = policy.type === CONST.POLICY.TYPE.CORPORATE;

    return (
        <ScreenWrapper
            shouldShowOfflineIndicator
            testID="workspaceUpgradePage"
        >
            <HeaderWithBackButton
                title={translate('common.upgrade')}
                onBackButtonPress={() => Navigation.goBack()}
            />
            {isUpgraded && <UpgradeConfirmation policyName={policy.name} />}
            {!isUpgraded && (
                <UpgradeIntro
                    title={translate(feature.title)}
                    description={translate(feature.description)}
                    icon={feature.icon}
                    onUpgrade={upgradeToCorporate}
                    buttonDisabled={isOffline}
                    loading={policy.isPendingUpgrade}
                />
            )}
        </ScreenWrapper>
    );
}

export default WorkspaceUpgradePage;
