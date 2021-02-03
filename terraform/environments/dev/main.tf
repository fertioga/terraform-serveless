data "aws_caller_identity" "current" {}

module "users" {
  source                = "../../infra/users"
  environment           = var.environment
  dynamo_write_capacity = 1
  dynamo_read_capacity  = 1
  jwt_secret            = var.jwt_secret
}

module "bookings" {
  source                = "../../infra/bookings"
  environment           = var.environment
  dynamo_write_capacity = 1
  dynamo_read_capacity  = 1
  sns_notifications_arn = module.notifications.notifications_topic_arn 
}

module "notifications" {
  source      = "../../infra/notifications"
  environment = var.environment
  account_id  = data.aws_caller_identity.current.account_id #injeta o id da conta para o modulo usar
  region      = var.region 
}

module "system" {
  source              = "../../infra/system"
  environment         = var.environment
  email_from          = var.email_from
  email_from_password = var.email_from_password
  email_to            = var.email_to
  smtp_server         = var.smtp_server  
}