import { analyserNave, decoderEntites } from '../analyseNave'

const AARON = [
  '<p>Généalogie de, <a href="v=2-6-16,17,18,19,20">Ex 6:16-20</a>; <a href="v=13-6-1,2,3">1 Ch 6:1-3</a></p>',
  '<p>Mari d&#x27;Élischéba, <a href="v=2-6-23">Ex 6:23</a></p>',
  '<p>Porte-parole de Moïse : <a href="v=2-4-14">Ex 4:14</a>. Voir <a href="w=moise">Moïse</a></p>',
  '<p>Voir aussi <a href="w=pretre">Prêtre</a>; <a href="w=moise">Moïse</a></p>',
].join('')

describe('analyserNave', () => {
  it('lit les rubriques dans l’ordre, avec leurs passages', () => {
    const analyse = analyserNave(AARON)
    expect(analyse.rubriques.map(rubrique => rubrique.intitule)).toEqual([
      'Généalogie de',
      'Mari d’Élischéba',
      'Porte-parole de Moïse',
    ])
    expect(analyse.rubriques[0]).toMatchObject({
      references: 2,
      premierPassage: '2-6-16,17,18,19,20',
    })
    expect(analyse.totalReferences).toBe(4)
  })

  it('rassemble les renvois sans doublons', () => {
    expect(analyserNave(AARON).voirAussi).toEqual([
      { cle: 'moise', nom: 'Moïse' },
      { cle: 'pretre', nom: 'Prêtre' },
    ])
  })

  it('décode les entités HTML', () => {
    expect(decoderEntites('&#xE9;t&#233; &amp; co')).toBe('été & co')
  })
})
