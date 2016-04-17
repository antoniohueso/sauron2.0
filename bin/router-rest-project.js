"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const repository_1 = require("./repository");
const express_1 = require("express");
exports.router = express_1.Router();
exports.router.use('/:projectKey', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.send(yield repository_1.repository.findProjectByKey(req.params.projectKey));
    }
    catch (e) {
        next(e);
    }
}));
