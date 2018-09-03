<?
				define("B_PROLOG_INCLUDED", true);
				define("WIZARD_DEFAULT_SITE_ID", "s3");
				define("WIZARD_DEFAULT_TONLY", true);
				define("PRE_LANGUAGE_ID","ru");
				define("PRE_INSTALL_CHARSET","UTF-8");
				include_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/install/wizard/wizard.php");
				?>
				

<?
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/header.php');
$APPLICATION->SetTitle("Главная");
?>
<?echo('Здрасссте)');?>
<?
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/footer.php');
?>