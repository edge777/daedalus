// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { remote } from 'electron';
import PasswordChoiceDialog from '../../../../components/wallet/paper-wallet-certificate/PasswordChoiceDialog';
import type { StoresMap } from '../../../../stores/index';
import type { ActionsMap } from '../../../../actions/index';

type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  onClose: Function,
  onBack: Function,
};

@inject('stores', 'actions') @observer
export default class PasswordChoiceDialogContainer extends Component<Props> {
  static defaultProps = { actions: null, stores: null };

  onContinue = (values: { password: string, repeatPassword: string }) => {
    const filePath = remote.dialog.showSaveDialog({
      defaultPath: '~/paper-wallet-certificate.pdf',
      filters: [{
        name: 'paper-wallet-certificate',
        extensions: ['pdf']
      }]
    });

    // if cancel button is clicked or path is empty
    if (!filePath) return;

    const data = { ...values, filePath };
    this.props.actions.ada.wallets.generateCertificate.trigger(data);
  };

  render() {
    const { stores } = this.props;
    const { wallets } = stores.ada;

    return (
      <PasswordChoiceDialog
        inProgress={wallets.generatingCertificateInProgress}
        onContinue={this.onContinue}
        onClose={this.props.onClose}
        onBack={this.props.onBack}
      />
    );
  }
}