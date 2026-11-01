# Claude com skills

## O pedido
"Faça um vídeo estilo motion usando a skill do repositório. O vídeo deve ser uma demonstração do
que o Claude com skills é capaz de fazer. Capricha, liga o mega brain e surpreende."
Destino deduzido: vídeo de demonstração (site, redes, apresentação) → 16:9, ~26 s, 60 qps, sem som.

## Referências lidas
Sem vídeo de referência. A régua foi `exemplos-de-nivel/` da própria skill (revelação em etapas,
bento que acende, pilha que vira órbita, fechamento com luz): dela vêm a física (objeto tem peso,
letra não quica), as curvas, o hold vivo e os mergulhos como corte invisível.

## A marca
Direção lida da identidade pública do Claude, sem copiar a logo:
- preto quente `#0f0e0c`, creme de papel `#f0eee6`, um único destaque terracota `#d97757`;
- títulos em Instrument Serif (OFL) peso regular, texto em Inter, o pedido com cursor terracota;
- o símbolo é uma faísca de oito raios desenhada para este filme (não é a logo oficial).

## Conceito
**A faísca como fio condutor.** O filme começa com o pedido real ("Faz um vídeo que surpreenda")
sendo digitado; o cursor vira um ponto de luz; do ponto nasce a faísca; a faísca vira o sol dos
oito ofícios; a câmera mergulha no "o" de "Motion design" e cai dentro da prancha do storyboard
**deste próprio filme** (a virada: "Inclusive este vídeo"); mergulha no quadrinho 5, que é a cena
seguinte; os oito artefatos explodem numa órbita ("Do pedido à entrega"); a faísca fecha o filme.

| Cena | Papel | Dinâmica-assinatura | Passagem |
| --- | --- | --- | --- |
| pedido | o gancho | digitação humana com cursor que esquenta as letras; frase sugada para um ponto | corte invisível no ponto |
| faisca | a resposta | faísca nasce do ponto, meia chave + tique, "Claude" nasce da luz | corte invisível na faísca |
| oficios | o que ela sabe | feixes disparam dos raios e acendem os ofícios; "Motion design" esquenta | mergulho no "o" |
| bastidor | a virada | a prancha do storyboard do próprio filme acende quadrinho a quadrinho | mergulho no quadrinho 5 |
| entregas | a prova | pilha em accelerando → explosão em espiral → órbita viva | a câmera atravessa a órbita |
| fecho | a marca | rima com a resposta; tudo é tragado, vira ponto, traço de luz, apaga | o filme apaga sozinho |

## Decisões
- 120 BPM, 6 cenas, ~26 s, 16:9 a 60 qps. 9:16 fica para uma rodada, se pedir.
- Nada inventado: nenhum número, nenhum dado. A lista de ofícios corresponde a skills reais do
  Claude (motion design, planilhas, apresentações, documentos, código, gráficos, storyboards,
  campanhas).
- O gancho é a digitação (o motor sugere algo mais forte nos 2 primeiros segundos): mantido de
  propósito, porque o pedido é o que o filme inteiro responde; ficou mais rápido e com recuo de câmera.
- Storyboard e animação foram feitos numa tacada só (a pessoa pediu para surpreender); a prancha
  está em `storyboard/index.html` para revisão.

## Rodadas
- v1: primeira versão completa.
- v3–v5 (pedido: "mais dinâmico, sincronizado com a música, mais segundos"): 47,6 s no grid da
  trilha (~184 BPM, frases de 16 batidas). Intro ambiente = pedido + faísca nos pulsos; o drop
  (10,65 s) dispara o sol; mergulhos terminam no início de cada frase; cenas novas "montagem" (um
  ofício por compasso, panorâmica contínua) e "mosaico" (um artefato por batida, "Tudo isso a
  partir de uma frase"); o convite pousa na última pancada (43,6 s). Vídeo final com a música:
  render/v5/claude-com-skills-16x9-60fps-com-musica.mp4.
  Mantenha: a sincronia com a trilha; os dois "degraus" intencionais (cartão que bate na pilha,
  cartão branco que sai no chicote).
