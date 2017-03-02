import { ComponentFactoryResolver, Injectable, Injector, OpaqueToken, Type } from '@angular/core';
import { NgModuleLoader } from './ng-module-loader';

export const LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');



/**
 * @private
 */
@Injectable()
export class ModuleLoader {

  /** @internal */
  _cfrMap = new Map<any, ComponentFactoryResolver>();

  constructor(
    private _ngModuleLoader: NgModuleLoader,
    private _injector: Injector) {}


  load(modulePath: string): Promise<LoadedModule> {
    console.time(`ModuleLoader, load: ${modulePath}'`);

    const splitString = modulePath.split(SPLITTER);

    return this._ngModuleLoader.load(splitString[0], splitString[1]).then(loadedModule => {
      console.timeEnd(`ModuleLoader, load: ${modulePath}'`);
      const ref = loadedModule.create(this._injector);

      const component = ref.injector.get(LAZY_LOADED_TOKEN);

      this._cfrMap.set(component, ref.componentFactoryResolver);

      return {
        componentFactoryResolver: ref.componentFactoryResolver,
        component: component
      };
    });
  }

  getComponentFactory(component: Type<any>) {
    return this._cfrMap.get(component);
  }
}

const SPLITTER = '#';


/**
 * @private
 */
export function provideModuleLoader(ngModuleLoader: NgModuleLoader, injector: Injector) {
  return new ModuleLoader(ngModuleLoader, injector);
}


export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
};
