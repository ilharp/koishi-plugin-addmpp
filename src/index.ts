import execa from 'execa'
import { Logger, Schema } from 'koishi'

export const name = 'addmpp'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export const logger = new Logger('addmpp')

export function apply() {
  if (process.platform !== 'win32') return

  void execa(
    'powershell',
    [
      '-NonInteractive',
      '-NoLogo',
      '-NoProfile',
      '-Command',
      `Exit (Start-Process powershell -Verb RunAs -PassThru -Wait -Argument "-NonInteractive -NoLogo -NoProfile -Command Add-MpPreference -ExclusionPath '${process.cwd()}').ExitCode"`,
    ],
    { stdio: 'inherit', shell: false }
  ).on('close', (code) =>
    code
      ? void logger.warn(
          `运行未成功。如果 Koishi 正常工作，则可以安全地忽略此消息。（${code}）`
        )
      : undefined
  )
}
