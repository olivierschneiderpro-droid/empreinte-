/// Empreinte : les commentaires partagés sous une vidéo, un chant ou un passage.
/// Tout le monde peut les lire ; seul un compte peut écrire, et chacun ne modifie que les siens.
migrate(
  db => {
    const dao = new Dao(db)
    const users = dao.findCollectionByNameOrId('users')
    const auteur = 'user = @request.auth.id'
    const commentaires = new Collection({
      name: 'commentaires',
      type: 'base',
      schema: [
        { name: 'sujet', type: 'text', required: true, options: { max: 200 } },
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: { collectionId: users.id, cascadeDelete: true, maxSelect: 1 },
        },
        { name: 'nom', type: 'text', options: { max: 80 } },
        { name: 'texte', type: 'text', required: true, options: { max: 4000 } },
      ],
      indexes: ['CREATE INDEX idx_commentaires_sujet ON commentaires (sujet)'],
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && @request.data.user = @request.auth.id",
      updateRule: auteur,
      deleteRule: auteur,
    })
    return dao.saveCollection(commentaires)
  },
  db => {
    const dao = new Dao(db)
    return dao.deleteCollection(dao.findCollectionByNameOrId('commentaires'))
  }
)
