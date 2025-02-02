import React from 'react';
import { useGetAccountInfo } from 'hooks';

import icons from 'optionalPackages/fortawesome-free-solid-svg-icons';
import { useLedgerLogin } from 'services';
import ModalContainer from 'UI/ModalContainer';

import PageState from 'UI/PageState';
import { getGeneratedClasses } from 'utils';
import { withClassNameWrapper } from 'wrappers/withClassNameWrapper';
import AddressTable from './AddressTable';
import ConfirmAddress from './ConfirmAddress';
import LedgerConnect from './LedgerConnect';

const ledgerWaitingText = 'Waiting for device';

interface LedgerLoginContainerPropsType {
  callbackRoute: string;
  className?: string;
  shouldRenderDefaultCss?: boolean;
  wrapContentInsideModal?: boolean;
  redirectAfterLogin?: boolean;
  token?: string;
  onClose?: () => void;
}

function LedgerLoginContainer({
  callbackRoute,
  className = 'login-modal-content',
  shouldRenderDefaultCss = true,
  wrapContentInsideModal = true,
  redirectAfterLogin,
  onClose,
  token
}: LedgerLoginContainerPropsType) {
  const generatedClasses = getGeneratedClasses(
    className,
    shouldRenderDefaultCss,
    { spinner: 'fa-spin text-primary' }
  );
  const { ledgerAccount } = useGetAccountInfo();
  const [
    onStartLogin,
    { error, isLoading },
    {
      showAddressList,
      accounts,
      onGoToPrevPage,
      onGoToNextPage,
      onSelectAddress,
      onConfirmSelectedAddress,
      startIndex,
      selectedAddress
    }
  ] = useLedgerLogin({ callbackRoute, token, redirectAfterLogin });

  function getContent() {
    if (isLoading) {
      return (
        <PageState
          icon={icons.faCircleNotch}
          iconClass={generatedClasses.spinner}
          title={ledgerWaitingText}
        />
      );
    }
    if (ledgerAccount != null && !error) {
      return <ConfirmAddress token={token} />;
    }

    if (showAddressList && !error) {
      return (
        <AddressTable
          accounts={accounts}
          loading={isLoading}
          className={className}
          shouldRenderDefaultCss={shouldRenderDefaultCss}
          onGoToNextPage={onGoToNextPage}
          onGoToPrevPage={onGoToPrevPage}
          onSelectAddress={onSelectAddress}
          startIndex={startIndex}
          selectedAddress={selectedAddress?.address}
          onConfirmSelectedAddress={onConfirmSelectedAddress}
        />
      );
    }

    return <LedgerConnect onClick={onStartLogin} error={error} />;
  }
  return wrapContentInsideModal ? (
    <ModalContainer
      title={'Login with ledger'}
      className={className}
      onClose={onClose}
    >
      {getContent()}
    </ModalContainer>
  ) : (
    getContent()
  );
}

export default withClassNameWrapper(LedgerLoginContainer);
