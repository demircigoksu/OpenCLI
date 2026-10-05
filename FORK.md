# Resmi olmayan fork / Unofficial fork

Bu repo, [jackwener/OpenCLI](https://github.com/jackwener/OpenCLI) projesinin kişisel kullanım için tutulan, **resmi olmayan** bir fork'udur. OpenCLI'nin geliştiricileriyle bir bağı yoktur. Orijinal proje Apache License 2.0 ile lisanslıdır ve bu fork da aynı lisansla dağıtılır (bkz. `LICENSE`).

This repository is an **unofficial** fork of [jackwener/OpenCLI](https://github.com/jackwener/OpenCLI), maintained for personal use. It is not affiliated with or endorsed by the OpenCLI authors. The original project is licensed under the Apache License 2.0 and this fork is distributed under the same license (see `LICENSE`).

## Dal yapısı / Branches

- `goksu-yamalar`: upstream sürüm etiketinin üstüne uygulanmış yamalar / patches applied on top of an upstream release tag.
- `yedek/<sürüm>_<tarih>` etiketleri: güncellemelerden önce alınan yedekler / backups taken before each update.

## Değişiklikler / Changes

Değiştirilen dosyaların ilk satırında bir not bulunur. / Every modified file carries a notice on its first line.

| Dosya / File | Değişiklik / Change |
|---|---|
| `src/goksu-auth.ts` (yeni / new) | Yerel daemon için gizli anahtar (`~/.opencli/daemon-token`) ve izinli eklenti kimliği (`~/.opencli/allowed-extension-id`). / Local daemon token and pinned extension ID. |
| `src/daemon.ts` | Komut uç noktaları gizli anahtar ister (salt okunur `GET /status` hariç). İzinli eklenti kimliği tanımlıysa WebSocket'e sadece o eklenti bağlanabilir. `POST /goksu/reload-extension` uç noktası eklendi. / Command endpoints require the token (except read-only `GET /status`); WebSocket accepts only the pinned extension when configured; added a reload endpoint. |
| `src/browser/daemon-transport.ts` | CLI istekleri gizli anahtarı gönderir. / CLI requests send the token. |
| `extension/src/background.ts` | Daemon'dan gelen `goksu-reload` mesajıyla eklenti kendini yeniden yükler. / Extension reloads itself on a `goksu-reload` message. |

Gizli anahtar ve eklenti kimliği dosyaları repoda yer almaz, her makinede yerel olarak oluşturulur.
Token and extension ID files are never committed; they are created locally on each machine.
