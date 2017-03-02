import { App } from '../app/app';
import { Config } from '../../config/config';
import { isString } from '../../util/util';

import { ModalOptions } from './modal-options';
import { NavOptions } from '../../navigation/nav-util';
import { LoadedModule, ModuleLoader } from '../../util/module-loader';

import { ModalImpl } from './modal-impl';

/**
 * @private
 */
export class Modal {

  constructor(private app: App, private component: any, private data: any, private opts: ModalOptions = {}, private config: Config, private moduleLoader: ModuleLoader) {
  }

  /**
   * Present the action sheet instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    // check if it's a lazy loaded component, or not
    const isLazyLoaded = isString(this.component);
    if (isLazyLoaded) {
      return this.moduleLoader.load(this.component).then((response: LoadedModule) => {
        this.component = response.component;
        const viewController = new ModalImpl(this.app, this.component, this.data, this.opts, this.config);
        return viewController.present();
      });
    } else {
      const viewController = new ModalImpl(this.app, this.component, this.data, this.opts, this.config);
      return viewController.present();
    }
  }

}
