import type { AnchorProps as SolidAnchorProps, NavigateOptions as SolidNavigateOptions, NavigateProps as SolidNavigateProps } from '@solidjs/router'

type HasRequiredKeys<T> = keyof T extends never
  ? false
  : { [K in keyof T]-?: undefined extends T[K] ? never : K }[keyof T] extends never
      ? false
      : true

type ComponentProps<Path extends string, Params extends Record<string, any>> = Path extends keyof Params
  ? HasRequiredKeys<Params[Path]> extends true
    ? { href: Path, params: Params[Path] }
    : { href: Path, params?: Params[Path] }
  : { href: Path, params?: never }

export type AnchorProps<Path extends string, Params extends Record<string, any>> = Omit<SolidAnchorProps, 'href'>
  & ComponentProps<Path, Params>

export type NavigateProps<Path extends string, Params extends Record<string, any>> = Omit<SolidNavigateProps, 'href'>
  & ComponentProps<Path, Params>

export type NavigateOptions<Path extends string, Params extends Record<string, any>> = Path extends keyof Params
  ? HasRequiredKeys<Params[Path]> extends true
    ? [Partial<SolidNavigateOptions> & { params: Params[Path] }]
    : [Partial<SolidNavigateOptions> & { params?: Params[Path] }] | []
  : [Partial<SolidNavigateOptions> & { params?: never }] | []
