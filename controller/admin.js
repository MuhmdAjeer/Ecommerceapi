const Admin = require('../Model/admin')

module.exports = {
    login: async (req, res) => {
        const {email} = req.body
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(404).json({
                message : "Admin doesnt exist"
            })
        }
    }
}