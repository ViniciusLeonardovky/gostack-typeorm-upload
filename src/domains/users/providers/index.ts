import { container } from 'tsyringe';

import { IHashProvider } from '@domains/users/providers/HashProvider/models/IHashProvider';
import { BCryptHashProvider } from '@domains/users/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
