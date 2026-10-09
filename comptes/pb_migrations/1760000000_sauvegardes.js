/// Empreinte : la base de comptes hébergée sur le serveur (PocketBase 0.22).
/// Les comptes eux-mêmes sont dans la collection « users » fournie par PocketBase ;
/// « sauvegardes » garde, pour chaque compte, ce qu'il a écrit et marqué (notes, surlignages,
/// études, marque-pages, étiquettes, plans, symbole). Chacun ne voit que sa propre sauvegarde.
migrate(
  db => {
    const dao = new Dao(db)
    const users = dao.findCollectionByNameOrId('users')
    const proprietaire = 'user = @request.auth.id'
    const sauvegardes = new Collection({
      name: 'sauvegardes',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: { collectionId: users.id, cascadeDelete: true, maxSelect: 1 },
        },
        { name: 'donnees', type: 'json', options: { maxSize: 50000000 } },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_sauvegardes_user ON sauvegardes (user)'],
      listRule: proprietaire,
      viewRule: proprietaire,
      createRule: "@request.auth.id != '' && @request.data.user = @request.auth.id",
      updateRule: proprietaire,
      deleteRule: proprietaire,
    })
    return dao.saveCollection(sauvegardes)
  },
  db => {
    const dao = new Dao(db)
    return dao.deleteCollection(dao.findCollectionByNameOrId('sauvegardes'))
  }
)
