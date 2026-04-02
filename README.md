# EDUTeaser — LegalCrew Academy 티저

리걸크루 변호사 실전 압축 부트캠프(The Rookie Camp) **강사(멘토) 섭외**용 티저·신청·동의서·어드민을 담은 Next.js 앱입니다. 상세 도메인·API·DB는 `CLAUDE.md`, `SPEC_v2.0_FINAL.md`를 참고하세요.

## 실행

```bash
npm install
npm run dev
```

## UI / 디자인 시스템

이 저장소의 화면은 로컬 **`DESIGN.md`**(Airtable 스타일 요약)를 구현 기준으로 삼습니다. 그 문서의 바탕이 된 **원본 설명**은 아래와 같습니다(비공식 추출, 수치·서체는 참고용).

[Airtable Inspired Design System](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/airtable/README.md)에서 발췌한 요지:

- [DESIGN.md (upstream)](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/airtable/DESIGN.md)는 공개 [airtable.com](https://airtable.com/) 사이트를 바탕으로 정리한 것이며, **공식 디자인 시스템이 아닙니다**. 색·폰트·간격이 실제와 100% 일치하지 않을 수 있습니다.
- 동일 레포에는 토큰 카탈로그용 **`preview.html`**(라이트), **`preview-dark.html`**(다크)가 있습니다. 이 프로젝트 루트에는 포함하지 않았습니다. 필요하면 upstream에서 받아 참고하면 됩니다.
- AI 에이전트용 레퍼런스로 upstream `DESIGN.md`를 쓰는 방식과 동일하게, **이 프로젝트에서는 루트의 `DESIGN.md` + `src/app/globals.css`의 `@theme` 토큰**을 기준으로 맞춥니다.

### 프리뷰 스크린샷 (upstream 예시)

업스트림 README에 실린 샘플 랜딩(라이트/다크) 이미지:

| 모드 | 미리보기 |
|------|-----------|
| Dark | ![Airtable Design System — Dark Mode](https://pub-2e4ecbcbc9b24e7b93f1a6ab5b2bc71f.r2.dev/designs/airtable/preview-dark-screenshot.png) |
| Light | ![Airtable Design System — Light Mode](https://pub-2e4ecbcbc9b24e7b93f1a6ab5b2bc71f.r2.dev/designs/airtable/preview-screenshot.png) |

## 이 저장소의 디자인 관련 파일

| 파일 | 설명 |
|------|------|
| `DESIGN.md` | 이 프로젝트에 맞게 사용 중인 디자인 시스템 요약(9섹션 구조) |
| `src/app/globals.css` | Tailwind v4 `@theme` — 색·폰트·유틸(`shadow-airtable` 등) |

자세한 구현 순서·보안 규칙은 `CLAUDE.md`를 참조하세요.
